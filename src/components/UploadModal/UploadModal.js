import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';

import { AppContext } from '../../App'
import { app } from '../../firebase';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import './UploadModal.css'

// const db = app.firestore()

function UploadModal() {

    const userContext = useContext(AppContext)

    const UPLOAD_ENDPOINT = 'https://boiling-caverns-35260.herokuapp.com/posts/upload'

    const [file, setFile] = useState(null)

    const history = useHistory()
    const [charLimit, setCharLimit] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [fileTooLargeError, setFileTooLargeError] = useState(false)

    const _handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const _handleDescriptionChange = e => {
        const chars = e.target.value
        setCharLimit(chars.length)

        setDescription(e.target.value)
    }

    const _handleCloseClick = () => {
        history.goBack()
    }

    const _handleFileChange = e => {
        const fileRef = e.target.files[0]
        setFile(fileRef)
    }

    const _handleUpload = async e => {
        e.preventDefault()

        // FILE UPLOAD
        try {
            if (file.size > 50000000) {
                setFileTooLargeError(true)
                return
            }
            const storageRef = await app.storage().ref()
            const fileRef = await storageRef.child(file.name)
            await fileRef.put(file)
            
            const response = await fetch(UPLOAD_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    description: description,
                    fileURL: await fileRef.getDownloadURL(),
                    fileType: await file.type.substring(0, 5),
                    likes: 0,
                    dislikes: 0,
                    user: userContext.userObj.username,
                    userID: userContext.userObj._id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 201) {
                history.goBack()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="upload-modal-bg flex-container">
            <form className='upload-form flex-container' onSubmit={_handleUpload}>
                <div className="close" onClick={_handleCloseClick}>+</div>
                <h2>New Post</h2>
                <label htmlFor="title"></label>
                <input value={title} onChange={_handleTitleChange} placeholder='What was your most recent play?!' required className='title' type="text" id="title" />
                <label htmlFor="description"></label>
                <textarea value={description} placeholder='More about it..?' maxLength='1200' onChange={_handleDescriptionChange} type="text" className='description' id="description" />
                {
                    <div className='char-limit'>Charachter Limit: {charLimit}/1200</div>
                }
                <div><input onChange={_handleFileChange} accept='image/* video/*' type="file" id="file" /></div>
                {
                    fileTooLargeError && <ErrorMessage error='File is too large' />
                }
                <input className='upload-button' type="submit" value='Upload' />
            </form>
        </div>
    );
}

export default UploadModal;