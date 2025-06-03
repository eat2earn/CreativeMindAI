import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Basic auth fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile fields
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot be more than 30 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    bio: { type: String, default: '' },
    profileImage: {
        data: { type: String }, // Base64 string of the image
        contentType: { type: String } // MIME type of the image
    },
    joinDate: { type: Date, default: Date.now },

    // Usage statistics
    creditBalance: { type: Number, default: 5 },
    imagesGenerated: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 },

    // Usage history
    imageHistory: [{
        date: { type: Date, default: Date.now },
        prompt: String,
        credits: { type: Number, default: 1 }
    }],
    voiceHistory: [{
        date: { type: Date, default: Date.now },
        text: String,
        credits: { type: Number, default: 1 }
    }],
    bgRemovalHistory: [{
        date: { type: Date, default: Date.now },
        credits: { type: Number, default: 1 }
    }]
}, {
    timestamps: true
});

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
    return {
        fullName: this.name,
        email: this.email,
        username: this.username,
        bio: this.bio,
        profileImage: this.profileImage,
        joinDate: this.joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        creditBalance: this.creditBalance,
        imagesGenerated: this.imagesGenerated,
        apiCalls: this.apiCalls
    };
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;