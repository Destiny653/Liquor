const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const dbUrl = process.env.MONGO;

if (!dbUrl) {
    console.error('MONGO is not defined in .env');
    process.exit(1);
}


// Define old schemas for migration
const OldSchema = new mongoose.Schema({
    title: String,
    content: String,
    price: mongoose.Schema.Types.Mixed, // Can be string or number in old models
    rate: Number,
    img: String,
    productModel: String,
    bundleItems: [String],
    isBestSeller: Boolean,
    occasion: String
}, { timestamps: true, strict: false });

// New Unified Product Schema
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    price: { type: Number, required: true },
    rate: { type: Number, default: 0 },
    img: { type: String, required: true },
    productModel: { type: String, required: true, index: true },
    bundleItems: { type: [String], default: [] },
    isBestSeller: { type: Boolean, default: false },
    occasion: { type: String, default: 'General' }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Mapping of collection names to model values
const collections = [
    { name: 'blantons', model: 'blantons' },
    { name: 'buffalos', model: 'buffalos' },
    { name: 'pappies', model: 'pappies' },
    { name: 'penelopes', model: 'penelopes' },
    { name: 'wellers', model: 'wellers' },
    { name: 'yamazakis', model: 'yamazakis' },
    { name: 'gifts', model: 'gifts' },
    { name: 'posts', model: 'posts' }
];

async function migrate() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        for (const coll of collections) {
            console.log(`Migrating ${coll.name}...`);
            const OldModel = mongoose.model(coll.name, OldSchema, coll.name);
            const items = await OldModel.find();

            console.log(`Found ${items.length} items in ${coll.name}`);

            for (const item of items) {
                // Prepare item for new collection
                const newItemData = {
                    title: item.title,
                    content: item.content,
                    price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
                    rate: item.rate || item.rating || 0,
                    img: item.img,
                    productModel: coll.model,
                    bundleItems: item.bundleItems || [],
                    isBestSeller: item.isBestSeller || false,
                    occasion: item.occasion || 'General',
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                };

                // Check if already exists to avoid duplicates (optional, based on title/content)
                const existing = await Product.findOne({ title: newItemData.title, productModel: newItemData.productModel });
                if (!existing) {
                    await Product.create(newItemData);
                }
            }
            console.log(`Finished migrating ${coll.name}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
