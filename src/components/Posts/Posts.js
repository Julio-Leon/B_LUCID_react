import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';

import './Posts.css'

function Posts({ startCount }) {

    const [posts, setPosts] = useState(null)

    const getPosts = async () => {
        const POSTS_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/${startCount}/${startCount + 10}`
        try {
            const response = await fetch(POSTS_ENDPOINT)
            const data = await response.json()
            setPosts(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getPosts()
    }, [])

    if (posts) {
        console.log('POSTS STATE:', posts)
    }

    return (
        <div className='posts'>
            {
                posts && posts.map(post => {
                    return <Post key={post._id} getPosts={getPosts} post={post} />
                })
            }
        </div>
    );
}

export default Posts;