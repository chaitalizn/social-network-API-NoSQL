const router = require('express').Router();
const { 
    getAllThought, 
    getThoughtById, 
    addThought, 
    updateThought, 
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThought)
    .post(addThought);

router
    .route('/:id')
    .post(addThought)
    .get(getThoughtById)
    .put(updateThought)
    
router 
    .route('/:userId/:thoughtId')
    .put(addReaction)
    .delete(deleteThought)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction)

module.exports = router;