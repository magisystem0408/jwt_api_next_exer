import {useEffect} from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import {getAllTasksData} from "../lib/tasks";
import Task from "../components/Task";
import TaskForm from "../components/TaskForm";

import StateContextProvider from "../context/StateContext";

// 非同期データ取得を楽にする
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/list-task/`


export default function TaskPage({staticfilterdTasks}) {

    // useSWR(クライアントサイドからfetchしたurl,)
    // mutateでdataのキャッシュを更新してくれる

    const {data: tasks, mutate} = useSWR(apiUrl, fetcher, {

        // ビルドしたものが初期値として与えられる
        initialData: staticfilterdTasks
    })

    // データをソートをする
    const filteredTasks = tasks?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )

    // 第二引数[]でマウントされた時、一回実行するようにする
    useEffect(() => {
        mutate()
    }, []);

    return (
    // どれでも選択することができるようになった
        <StateContextProvider>
            <Layout title="Task page">

                <TaskForm  taskCreated={mutate}/>

                {/*タスクの展開*/}
                <ul>
                    {filteredTasks &&
                    filteredTasks.map((task) => <Task key={task.id} task={task} taskDeleted={mutate}/>)}
                </ul>

                <Link href="/main-page">
                    <div className="flex cursor-pointer mt-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                        </svg>
                        <span>Back to main page</span>
                    </div>
                </Link>
            </Layout>
        </StateContextProvider>
    )

}

// ビルド時に呼ばれる

export async function getStaticProps() {
    const staticfilterdTasks = await getAllTasksData();

    return {
        props: {staticfilterdTasks},

        // 再生成される
        revalidate: 3
    }
}