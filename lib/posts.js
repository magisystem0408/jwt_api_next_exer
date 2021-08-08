import fetch from "node-fetch"

export async function getAllPostsData(){
    const res =await fetch(new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/list-post/`))
    const posts =await res.json()

    // 日付順にソートできる

    const filterPosts =posts.sort(
        (a,b) =>new Date(b.created_at) -new Date(b.created_at)
    );
    return filterPosts
}

// 投稿一覧のIDを取得

export async function getAllPostIds(){
    const res =await fetch(new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/list-post/`))
    const posts =await res.json()
    return posts.map((post)=>{
        return{
            params:{
                id:String(post.id)
            }
        }
    })
}


export async function getPostData(id){
    const res =await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/detail-post/${id}/`)
    )
    const post  =await res.json()
    return {
        post
    }
}