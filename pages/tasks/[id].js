import {useEffect} from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import {useRouter} from "next/router";
import useSWR from "swr";
import {getAllTaskIds,getTaskData} from "../../lib/tasks";

const fetcher =(url) =>fetch(url).then((res) =>res.json())

export default function Task({staticTask,id}){
    const router =useRouter()
    const {data:task,mutate} =useSWR(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/detail-task/${id}`,
        fetcher,
        {
            initalData:staticTask
        }
    );
    // 確実に更新されるようにする
    useEffect(()=>{
        mutate()
    },[]);
    if(router.isFallback || !task){
        return <div>ロード中</div>
    }
    return <Layout title={task.title}>
        <span className="mb-4">
            {"ID："}
            {task.id}
        </span>
        <p className="mb-4 text-xl font-bold">{task.title}</p>
        <p className="mb-12">{task.created_at}</p>

        <Link href="/task-page">
            <div className="flex cursor-pointer mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                </svg>
                <span>戻る</span>
            </div>


        </Link>
    </Layout>

}


// ビルド時にサーバーサイドで実行されるタスク
// id取得
export async function getStaticPaths(){
    const paths =await getAllTaskIds()
    return{
        paths,
        fallback:true
    }

}

//ビルド時にidに基づいてデータを取得してくる
export async function getStaticProps({params}){
    const {task:staticTask} =await getTaskData(params.id)
    return {
        props:{
            id: staticTask.id,
            staticTask
        },
        // ISRを有効化しておく
        revalidate:3
    }
}