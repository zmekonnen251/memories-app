import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import FileBase from 'react-file-base64';
import classes from './styles.js';
import { createPost, updatePost } from '../../redux/actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });
  const post = useSelector((state) =>
    currentId ? state.posts.find((p) => p._id === currentId) : null
  );

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
    }
    handleClear();
  };
  const handleClear = () => {
    setCurrentId(null);
    setPostData({
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  };

  if (!user?.result?.name) {
    return (
      <Paper sx={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={classes.paper}>
      <form
        sx={classes.form}
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? 'Editing' : 'Creating'} a Memory
        </Typography>

        <TextField
          sx={classes.fileInput}
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />

        <TextField
          multiline
          rows={4}
          sx={classes.fileInput}
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />

        <TextField
          sx={classes.fileInput}
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(',') })
          }
        />

        <Box sx={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </Box>

        <Button
          sx={classes.buttonSubmit}
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={handleClear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
