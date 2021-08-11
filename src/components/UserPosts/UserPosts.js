import React from 'react';
import Post from '../Post/Post';

function UserPosts({ posts, getPosts }) {
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

export default UserPosts;