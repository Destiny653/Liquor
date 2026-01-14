const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const productModelSchema = new mongoose.Schema({
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String, default: "" }
}, { timestamps: true });

const ProductModel = mongoose.models.ProductModel || mongoose.model("ProductModel", productModelSchema);

const initialBrands = [
    {
        value: 'blantons',
        label: 'Blanton',
        description: 'Distinguished single malt selection',
        image: '/images/gift3.jpg'
    },
    {
        value: 'buffalos',
        label: 'Buffalo Trace',
        description: 'Award-winning Kentucky bourbon',
        image: '/images/bestsell3.jpg'
    },
    {
        value: 'pappies',
        label: 'Pappy Van Winkle',
        description: 'The most sought-after bourbon',
        image: '/images/bestsell1.jpg'
    },
    {
        value: 'penelopes',
        label: 'Penelope',
        description: 'Crafted four-grain bourbon',
        image: '/images/gift2.jpg'
    },
    {
        value: 'wellers',
        label: 'W.L. Weller',
        description: 'Premium wheated bourbon',
        image: '/images/bestsell2.jpg'
    },
    {
        value: 'yamazakis',
        label: 'Yamazaki',
        description: 'Japanese whisky excellence',
        image: '/images/gift1.jpg'
    },
    {
        value: 'gifts',
        label: 'Gift Bundles',
        description: 'Exclusive curated spirit sets',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop'
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to DB");

        for (const brand of initialBrands) {
            await ProductModel.findOneAndUpdate(
                { value: brand.value },
                brand,
                { upsert: true, new: true }
            );
        }

        console.log("Seeding completed");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
}

seed();
