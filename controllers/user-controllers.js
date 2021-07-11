const { User, Thought } = require('../models');

const userController = {
    // the functions will go in here as methods
    //GET all user
    getAllUser(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //GET single user by its _id and populated thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .then(dbUserData => {
            //If no user is found, send 404
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    

    //POST a new user
    // {
    // "username": "lernantino",
    //  "email": "lernantino@gmail.com"
    // }
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

        // add new friend to user's friend list
        addFriend( { params } , res) {
            console.log(params)
            User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: params.friendId } },
                { new: true, runValidators: true }
            )
            .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //PUT to update user by its _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //DELETE to remove user by its _id BONUS: remove a user's associated thoughts when deleted
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
            }
            return Thought.deleteMany(
                { _id: params.thoughtId },
                { $pull: { users: params.userId } },
                { new: true }
            );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts found with this id!'});
                    return;
                }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }

    // remove a friend from a user's friend list 
    
};

module.exports = userController;