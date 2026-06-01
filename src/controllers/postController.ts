import { Request, Response } from "express";
import postService from "../services/postService.ts";
import { CreatePostInputType } from "../schemas/post/createPostSchema.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";
import { AuthRequest } from "../middlewares/auth.ts";

const getPostsByCategory = async (req: Request<{ categoryId: string }>, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        if (isNaN(categoryId)) {
            res.status(400).json({ message: "유효하지 않은 카테고리 ID 입니다. " });
            return;
        }

        const result = await postService.getPostsByCategory(categoryId, page, size);

        res.status(200).json({
            message: "게시글 목록을 성공적으로 불러왔습니다.",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생되었습니다.",
        });
    }
};

// 컨트롤러는 기본적으로 Express에서 제공해주는 Request와 Response를 사용해야 했던 것
// 그 규칙 안에 Request에 동적 라우팅을 통해 주소값을 가져오려면 Generic인 Request<{ id: string }>
// ->
// 우리는 미들웨어를 통해, req라고 하는 요청 내용이 담기는 박스에 req.user 항목을 집어넣기로 한 것
// 그렇기 때문에 AuthRequest라고, Request 타입을 상속받은 것으로 교체한 상황
//   =
// 이렇게 했더니, 우리가 만든 AuthRequest는 Generic이 아니라서 동적 라우팅을 받을 수가 없음
// 이걸 어떻게든 해결 해야 된다면?
// GET 방식으로 받게끔 디자인 했기 때문에 동적 라우팅을 했던 것.
// POST 방식으로 하면 req.body를 쓸 수 있게 됨
// GET 방식은 조회할 때 쓰고, POST는 생성할 때 쓰고, PATCH와 PUT은 수정할 때 쓰고, DELETE는 삭제할 때 쓰고
// 느슨하게 적용해도 됨 => 이렇게 나눈 것을 백앤드와 프론트앤드가 합의만 한다면

// POST 방식으로 교체하면 문제 해결이 가능하지만,
// GET 방식을 고수하여 정석적으로 해결을 하려 한다면, 우리가 만든 AuthRequest가 인터페이스가
// Generic을 쓸 수 있도록 고쳐야 함


const getPostById = async (req: AuthRequest<{ id: string }>, res: Response) => {
    // 원래, 글 내용 조회라는 기능엔 "조회하는 사람이 누군가"는 중요하지 않았음"
    // 근데 "조회하는 사람"이 투표를 했나 안 했나를 알기 위해서는 "그 사람"이 누군가를 알아야 함

    // 글의 내용을 요청하는 사람에 대한 정보를 알기 위해서는 어디에 접근해야 하는가?
    try {
        const postId = Number(req.params.id);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시물 ID입니다." });
            return;
        }
        const userId = req.user?.id;
        const post = await postService.getPostById(postId, userId);
        res.status(200).json({
            message: "게시글을 성공적으로 불러왔습니다.",
            data: post,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const createPost = async (req: AuthRequest, res: Response) => {
    // req.body 에 들어온 값을 꺼내서, 서비스로 보내줘야 함
    // 즉, req.body로 들어온 내용을 토대로 데이터베이스에 쓸 수 있는 타입 객체로 바꿔서 보내야 함
    try {
        // 지금 요청을 하고 있는 사람이 누군지를 알아내려면, 데이터베이스에서 그 사용자 정보와 post를 연결해야 함
        // 누군지 알아내려면 그 정보는 req.header.authorization 을 까서
        // 그 token을 복호화 하면 { userId: number } 정보를 통해 user 테이블에서 사용자 정보를 불러오고
        // 그 사용자의 ID를 가지고 연결을 지어야 함

        // 이 과정을 보니, middleware로 만들어놨던 authenticate 가 하는 일이랑 같음
        // authenticate를 보니, req 박스에다가 이미 user라는 항목을 만들어서 스티커를 붙여서 보내주고 있음
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
        }

        const { title, content, categoryId, option1Text, option2Text }: CreatePostInputType =
            req.body;

        // post 테이블은 user 테이블과 category 테이블과 관계를 맺고 있음

        // option1Text, option2Text의 문제는 undefined 타입은 Javascript에만 존재하기 때문. 데이터베이스에 없음.
        const postData: PostCreateInput = {
            title,
            content,
            category: { connect: { id: categoryId } },
            user: { connect: { id: user.id } },
            option1Text: option1Text ?? null,
            option2Text: option2Text ?? null,
        };

        const newPost = await postService.createPost(postData);

        res.status(201).json({
            message: "게시글이 성공적으로 작성되었습니다.",
            data: newPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "게시글 작성 중 서버 에러가 발생되었습니다." });
    }
};

export default {
    getPostsByCategory,
    getPostById,
    createPost,
};
