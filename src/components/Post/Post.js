import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext  } from '../../App';
import { FcLike} from 'react-icons/fc'

import Comment from '../Comment/Comment';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import './Post.css'

function Post({ getPosts, post }) {

    const [showEditModal, setShowEditModal] = useState(false)

    const userContext = useContext(AppContext)
    const history = useHistory()

    const [likes, setLikes] = useState(post.likes.length)

    const type = post.fileType

    const likesArray = [...post.likes]

    const [likeButtonStyle, setLikeButtonStyle] = useState(likesArray.includes(userContext.userObj._id) ? 'pink' : 'white')
    
    const id = userContext.userObj._id
    
    const incrementLike = async () => {
        const LIKE_INCREMENT_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/increment-like/${post._id}`
        try {
            const response = await fetch(LIKE_INCREMENT_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    userID: id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    const decrementLike = async () => {
        const LIKE_DECREMENT_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/decrement-like/${post._id}`
        try {
            const response = await fetch(LIKE_DECREMENT_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    userID: id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    const _handleLike = async e => {
        const liked = e.target.style.color === 'pink'
        if (!liked) {
            incrementLike(e)
            setLikes(likes + 1)
            setLikeButtonStyle('pink')
        } else {
            decrementLike(e)
            setLikes(likes - 1)
            setLikeButtonStyle('white')
        }
    }

    const [charLimit, setCharLimit] = useState(false)
    const [title, setTitle] = useState(post.title)
    const [description, setDescription] = useState(post.description)

    const _handleDelete = async () => {
        const DELETE_POST_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/delete/${post._id}`
        try {
            const response = await fetch(DELETE_POST_ENDPOINT, {
                method: 'DELETE'
            })
            if (response.status === 204) {
                getPosts()
                alert('Post Deleted!')
            } else {
                alert('Delete Failed')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const _handleEdit = async e => {
        e.preventDefault()
        const EDIT_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/edit/${post._id}`
        try {
            const response = await fetch(EDIT_ENDPOINT, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title,
                    description: description
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 201) {
                setShowEditModal(false)
                getPosts()
            } else {
                alert('Edit Failed!')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const _handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const _handleDescriptionChange = e => {
        const chars = e.target.value
        setCharLimit(chars.length)

        setDescription(e.target.value)
    }

    const _handleCloseClick = () => {
        setShowEditModal(false)
    }

    const _handleEditButtonClicked = () => {
        console.log('HERE')
        setShowEditModal(true)
        console.log(showEditModal)
    }

    const [comment, setComment] = useState('')

    const _handleCommentChange = e => {
        setComment(e.target.value)
    }

    const _handleAddComment = async e => {
        const POST_COMMENT_ENDPOINT = `https://boiling-caverns-35260.herokuapp.com/posts/comment/${post._id}`
        try {
            const response = await fetch(POST_COMMENT_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    author: userContext.userObj.username,
                    body: comment,
                    post: post._id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 201) {
                setComment('')
                getPosts()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='post flex-container'>
            <div className="name-edit-remove flex-container">
                <h1 className='post-title'>{post.title}</h1>
                {
                    userContext.userObj.username === post.user && <div className="edit-remove flex-container">
                        <button className='edit-button' onClick={_handleEditButtonClicked}>Edit</button>
                        <button className='delete-button' onClick={_handleDelete}>Delete</button>
                    </div>
                }
            </div>
            <p className='post-description'>{post.description}</p>
            {
                type !== undefined && (type === 'video' ? (
                    <video className='file' width="750" height="500" controls >
                        <source src={post.fileURL} type="video/mp4"/>
                    </video> ) : (
                        <img className='file' src={post.fileURL} alt={post.title} />
                    ))
            }
            <div className="author-likes flex-container">
                <h2 className='post-author'>{post.user}</h2>
                <div className="likes flex-container">
                    <FcLike />
                    <div style={{color: likeButtonStyle}} onClick={_handleLike} className='post-likes flex-container'>{likes - 1}</div>
                </div>
            </div>
            <div className="comments flex-container">
                    {
                        post.comments.length > 0 && <div className="comments-array">
                            {
                                post.comments.map(comment => {
                                    return <Comment comment={comment} />
                                })
                            }
                        </div>
                    }
                <form className='add-comment' onSubmit={_handleAddComment}>
                    <input className='input-comment' type="text" value={comment} onChange={_handleCommentChange} placeholder='Post a comment!' />
                    <input type="submit" value="Post" />
                </form>
            </div>

            {/* EDIT MODAL START */}
            <div className="edit-modal-bg" style={{display: (showEditModal === true ? 'flex' : 'none')}}>
                <form onSubmit={_handleEdit} className='edit-form flex-container'>
                <div className="close" onClick={_handleCloseClick}>+</div>
                <label htmlFor="title"></label>
                <input value={title} onChange={_handleTitleChange} placeholder='What was your most recent play?!' required className='title' type="text" id="title" />
                <label htmlFor="description"></label>
                <textarea value={description} placeholder='More about it..?' maxLength='1200' onChange={_handleDescriptionChange} type="text" className='description' id="description" />
                {
                    <div className='char-limit'>Charachter Limit: {charLimit}/1200</div>
                }
                {/* <input onChange={_handleFileChange} accept='image/* video/*' type="file" id="file" />
                {
                    fileTooLargeError && <ErrorMessage error='File is too large' />
                } */}
                <input onSubmit={e => e.target.disabled = true} className='upload-button' type="submit" value='Save' />
                </form>
            </div>
            {/* EDIT MODAL END */}
        </div>
    );
}

export default Post;