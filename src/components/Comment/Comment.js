import React, { useContext } from 'react';
import { AppContext  } from '../../App';

import './Comment.css'

function Comment({ comment }) {

    const userContext = useContext(AppContext)

    return (
        <div className='comment flex-container'>
            <div className="author-body">
                {comment.author}: {comment.body}
            </div>
            {
               userContext.userObj.username === comment.author && <div className="delete">+</div>
            }
        </div>
    );
}

export default Comment;