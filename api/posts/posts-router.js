// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message: 'The posts information could not be retrieved'
      })
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Posts.findById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'The post information could not be retrieved'
      })
    })
});

router.post('/', (req, res) => {
  if (req.body.title && req.body.contents) {
    Posts.insert({
      title: req.body.title,
      contents: req.body.contents
    })
      .then(postedId => {
        Posts.findById(postedId.id)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(err => {
            res.status(500).json({
              message: 'There was an error while saving the post to the database'
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          message: 'There was an error while saving the post to the database'
        })
      })

  } else {
    res.status(400).json({
      message: 'Please provide title and contents for the post'
    })
  }
});

router.put('/:id', (req, res) => {
  if (req.body.title && req.body.contents) {
    const id = req.params.id;
    Posts.update(id, {
      title: req.body.title,
      contents: req.body.contents,
    })
      .then(updatedId => {
        if(updatedId) {
          Posts.findById(updatedId)
            .then(post => {
              res.status(200).json(post)
            })
            .catch(err => {
              res.status(500).json({
                message: 'The post information could not be modified'
              })
            })
        } else {
          res.status(404).json({
            message: 'The post with the specified ID does not exist'
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: 'The post information could not be modified'
        });
      })
  } else {
    res.status(400).json({
      message: 'Please provide title and contents for the post'
    })
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Posts.findById(id)
    .then(post => {
      if(post) {
        Posts.remove(id)
          .then(deletedId => {
            res.status(200).json(post)
          })
          .catch(err => {
            res.status(500).json({
              message: 'The post could not be removed'
            })
          })
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'The post could not be removed'
      });
    })
});

router.get('/:id/comments', (req, res) => {
  const id = req.params.id;
  Posts.findPostComments(id)
    .then(post => {
      if(post.length) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist'
        })
      }
    })
    .catch(err => {
      res.status(500)
    });
});

module.exports = router;
