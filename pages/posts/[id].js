import Link from "next/link";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {getAllPostIds, getAllPostsData, getPostData} from "../../lib/posts";

export default function Post({post}) {
    const router = useRouter();

    // fallbackは新しい記事を読み込んでいる

    if (　router.isFallback ||!post) {
        return <div>ロード中</div>
    }
    return <Layout title={post.title}>
        <p className="m-4">
            {"ID: "}
            {post.id}
            <p className="mb-4 text-xl font-bold">{post.title}</p>
            <p className="mb-12">{post.created_at}</p>
            <p className="px-10">{post.content}</p>

            <Link href="/blog-page">
                <div className="flex cursor-pointer mt-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                    </svg>
                    <span>ブログページに戻る</span>
                </div>
            </Link>
        </p>
    </Layout>
}

// fallbackをfalseにしていると新しく更新されなくなる

export async function getStaticPaths(){
    const paths =await getAllPostIds()
    return{
        paths,
        fallback:true,
    }
}

export async function getStaticProps({params}){
    const {post:post}=await getPostData(params.id)
    return{
        props:{
            post,
        },

        // 再生成が頻繁に行われないようにするためのインターバル
        revalidate:3
    }
}