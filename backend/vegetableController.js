const Vegetable = require('./Vegetable');

const defaultVegetables = [
    { name: 'Tomato (Tomato/Tamata)', pricePerKg: 40, image: 'https://nationaltoday.com/wp-content/uploads/2022/08/21-Fresh-Tomato-Day-1200x834.jpg', description: 'Fresh Farm Tomatoes', category: 'Vegetable' },
    { name: 'Potato (Bangaladumpa)', pricePerKg: 30, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', description: 'Fresh Organic Potatoes', category: 'Vegetable' },
    { name: 'Onion (Ullipaya)', pricePerKg: 35, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80', description: 'Red Onions', category: 'Vegetable' },
    { name: 'Carrot (Gajaragadda)', pricePerKg: 60, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80', description: 'Crunchy Orange Carrots', category: 'Vegetable' },
    { name: 'Cabbage (Patta Gobi)', pricePerKg: 40, image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&q=80', description: 'Fresh Green Cabbage', category: 'Vegetable' },
    { name: 'Brinjal (Vankaya)', pricePerKg: 50, image: 'https://wallpaperaccess.com/full/1465593.jpg', description: 'Purple Brinjal (Eggplant)', category: 'Vegetable' },
    { name: 'Capsicum (Bungamirapakaya)', pricePerKg: 80, image: 'https://th.bing.com/th/id/R.c953364b38f3e4de9dfd1226429cdc9d?rik=p2x07ECqLKOWSg&riu=http%3a%2f%2fcdn.shopify.com%2fs%2ffiles%2f1%2f0286%2f8586%2f0898%2fproducts%2fCapsicum_Green_1024x1024.jpg%3fv%3d1593836720&ehk=L6v93vbGe66zAy8jWev9SKJHwSL8sUwxrY94WKzfVQQ%3d&risl=&pid=ImgRaw&r=0', description: 'Fresh Green Capsicum', category: 'Vegetable' },
    { name: 'Spinach (Palakura)', pricePerKg: 25, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', description: 'Fresh Spinach Leaves', category: 'Leafy' },
    { name: 'Green Beans (Chikkudukaya)', pricePerKg: 70, image: 'https://stopfoodwaste.ie/wp-content/uploads/2019/01/green-beans-1018624_1920.jpg', description: 'Fresh Green Beans', category: 'Vegetable' },
    { name: 'Cauliflower (Gobi)', pricePerKg: 55, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&q=80', description: 'Fresh White Cauliflower', category: 'Vegetable' },
    { name: 'Bottle Gourd (Sorakaya)', pricePerKg: 40, image: 'https://fhasal.in/wp-content/uploads/2022/09/Bottle-Gourd-22.jpg', description: 'Fresh Bottle Gourd', category: 'Vegetable' },
    { name: 'Bitter Gourd (Kakarakaya)', pricePerKg: 60, image: 'https://th.bing.com/th/id/R.fbc6212e9bf986c2c5984b47e04672e2?rik=o3ggIfj8HZUgsg&riu=http%3a%2f%2fwww.foodofy.com%2fwp-content%2fuploads%2f2015%2f06%2fbitter-gourd-2.jpg&ehk=EOoowef4XaSMpGzbKP4xV%2fDnT218agOdpMadoLBXv50%3d&risl=&pid=ImgRaw&r=0', description: 'Fresh Bitter Gourd', category: 'Vegetable' },
    { name: 'Lady Finger (Bendakaya)', pricePerKg: 50, image: 'https://th.bing.com/th/id/R.642815913072a0bcbba55a1d87411d0b?rik=NAn2CMtEVvhv2Q&riu=http%3a%2f%2fwww.minislifestyle.com%2fcdn%2fshop%2fcollections%2flady-finger-benefits_1200x1200.jpg%3fv%3d1711089345&ehk=cupEGYy%2fJAm2QOsqfLrRAb6vRkfAv7Ud2XCNr3QzhPs%3d&risl=&pid=ImgRaw&r=0', description: 'Tender Okra (Bhindi)', category: 'Vegetable' },
    { name: 'Cucumber (Dosakaya)', pricePerKg: 30, image: 'https://tse1.mm.bing.net/th/id/OIP.Pptq85cznsBaq4FYoINv1AHaHb?w=716&h=718&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Salad Cucumber', category: 'Salad' },
    { name: 'Garlic (Vellulli)', pricePerKg: 120, image: 'https://th.bing.com/th/id/OIP.mbW52NegYUvqOfhXU7vlaAHaE9?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Garlic Bulbs', category: 'Spice' },
    { name: 'Ginger (Allam)', pricePerKg: 100, image: 'https://ipm.missouri.edu/MEG/2021/12/holidayFlavors-DT/spice.ginger.jpg', description: 'Fresh Root Ginger', category: 'Spice' },
    { name: 'Green Chilli (Pachimirapakaya)', pricePerKg: 60, image: 'https://www.slurrp.com/web/_next/image?url=https:%2F%2Fimages.slurrp.com%2Fprodarticles%2Fh07lficf2ve.webp%3Fimpolicy%3Dslurrp-20210601%26width%3D1200%26height%3D900%26q%3D75&w=3840&q=75', description: 'Spicy Green Chillies', category: 'Spice' },
    { name: 'Lemon (Nimmakaya)', pricePerKg: 80, image: 'https://images7.alphacoders.com/367/367384.jpg', description: 'Fresh Yellow Lemons', category: 'Fruit/Vegetable' },
    { name: 'Coriander (Kothimeera)', pricePerKg: 40, image: 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=500&q=80', description: 'Fresh Coriander Leaves', category: 'Leafy' },
    { name: 'Mint (Pudina)', pricePerKg: 30, image: 'https://tse1.mm.bing.net/th/id/OIP.vdv6h211_Jn-Nm9VC60U3AHaEl?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Mint Leaves', category: 'Leafy' },
    { name: 'Fenugreek (Menthi Koora)', pricePerKg: 30, image: 'https://cdn.pixabay.com/photo/2017/11/09/10/08/fenugreek-2932921_960_720.jpg', description: 'Fresh Fenugreek Leaves', category: 'Leafy' },
    { name: 'Radish (Mullangi)', pricePerKg: 35, image: 'https://cdn.tasteatlas.com/images/ingredients/4f4299a0b4bd4583a0a29fe243eec420.jpg', description: 'Fresh White Radish', category: 'Salad' },
    { name: 'Beetroot (Beetroot)', pricePerKg: 45, image: 'https://tse4.mm.bing.net/th/id/OIP.Y7exQ7M3M6GQ3qUSJTwk9AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Organic Beetroot', category: 'Vegetable' },
    { name: 'Pumpkin (Gummadikaya)', pricePerKg: 25, image: 'https://www.csrorganics.com/image/cache/catalog/Product/seeds/fruits/ashguard-seeds-600x315.jpg', description: 'Fresh Sweet Pumpkin', category: 'Vegetable' },
    { name: 'Pointed Gourd (Budamkaya)', pricePerKg: 60, image: 'https://tse1.mm.bing.net/th/id/OIP.2YFG0YA49WywT5a75Qi1zgHaE2?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Pointed Gourd (Parwal)', category: 'Vegetable' },
    { name: 'Ridge Gourd (Beerakaya)', pricePerKg: 50, image: 'https://www.ampimex.in/wp-content/uploads/2021/02/ridge-gourd.jpeg', description: 'Fresh Ridge Gourd', category: 'Vegetable' },
    { name: 'Sponge Gourd (Neti Beerakaya)', pricePerKg: 45, image: 'https://tse4.mm.bing.net/th/id/OIP.Xw7Nc60KivzY_5YjUk9uaAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Sponge Gourd', category: 'Vegetable' },
    { name: 'Ash Gourd (Boodida Gummadikaya)', pricePerKg: 40, image: 'https://static.toiimg.com/photo/102821555.cms', description: 'Fresh Ash Gourd', category: 'Vegetable' },
    { name: 'Drumstick (Mulakkada)', pricePerKg: 80, image: 'https://kj1bcdn.b-cdn.net/media/83798/drumstick.jpg', description: 'Fresh Drumsticks (Moringa)', category: 'Vegetable' },
    { name: 'Cluster Beans (Gokarakaya)', pricePerKg: 50, image: 'https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2023/08/b1-4.jpg?size=*:900', description: 'Fresh Cluster Beans', category: 'Vegetable' },
    { name: 'Ivy Gourd (Dondakaya)', pricePerKg: 45, image: 'https://tse1.mm.bing.net/th/id/OIP.h0NRO6br0ytxQG7ow2z70gHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Ivy Gourd', category: 'Vegetable' },
    { name: 'Colocasia (Chamadumpa)', pricePerKg: 50, image: 'https://tse4.mm.bing.net/th/id/OIP.I9TtUqjkedfFXIPJeiAZ_gHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh Taro Root (Arbi)', category: 'Vegetable' },
    { name: 'Sweet Potato (Chilakada Dumpa)', pricePerKg: 40, image: 'https://izzycooking.com/wp-content/uploads/2023/02/Sweet-Potatoes-01.jpg', description: 'Fresh Sweet Potatoes', category: 'Vegetable' },
    { name: 'Elephant Foot Yam (Kanda Dumpa)', pricePerKg: 65, image: 'https://kj1bcdn.b-cdn.net/media/83738/elephant-foot-yam.jpg?width=1200', description: 'Fresh Elephant Yam', category: 'Vegetable' },
    { name: 'Turnip (Turnip)', pricePerKg: 35, image: 'https://cdn-prod.medicalnewstoday.com/content/images/articles/284/284815/a-bunch-of-turnips-on-a-table.jpg', description: 'Fresh Turnips', category: 'Vegetable' },
    { name: 'Mushroom (Puttagodugulu)', pricePerKg: 150, image: 'https://tse4.mm.bing.net/th/id/OIP.0zEI5msPIY4KVa6MH0z2KQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Fresh White Button Mushrooms', category: 'Gourmet' },
    { name: 'Amaranth Leaves (Thotakura)', pricePerKg: 40, image: 'https://healthiersteps.com/wp-content/uploads/2022/06/amaranth-leavese-768x509.jpeg', description: 'Amaranth Leaves (Chaulai)', category: 'Leafy' },
    { name: 'Raw Banana (Aratikaya)', pricePerKg: 35, image: 'https://5.imimg.com/data5/WA_9696/Default/2025/5/508774074/BE/BX/TO/98239326/image-500x500.jpeg', description: 'Unripe Green Banana', category: 'Vegetable' },
    { name: 'Raw Papaya (Boppayikaya)', pricePerKg: 40, image: 'https://hindi.cdn.zeenews.com/hindi/sites/default/files/2023/11/01/2400115-rawpapaya2.jpg?im=FitAndFill=(1200,900)', description: 'Unripe Green Papaya', category: 'Vegetable' }
];

// Seed DB if empty OR update existing
const seedVegetables = async () => {
    try {
        // Clear existing default vegetables to ensure names and details are updated
        // We only do this for the default ones, or just clear all if it's a managed list
        await Vegetable.deleteMany({}); 
        await Vegetable.insertMany(defaultVegetables);
        console.log('Vegetables synchronized in Database');
    } catch (error) {
        console.error('Error seeding vegetables:', error);
    }
};

// @desc    Get all vegetables
// @route   GET /api/vegetables
const getVegetables = async (req, res) => {
    try {
        const vegetables = await Vegetable.find({});
        res.json(vegetables);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update vegetable price
// @route   PUT /api/vegetables/:id
const updateVegetablePrice = async (req, res) => {
    try {
        const { pricePerKg } = req.body;
        const vegetable = await Vegetable.findById(req.params.id);

        if (vegetable) {
            vegetable.pricePerKg = pricePerKg;
            const updatedVegetable = await vegetable.save();
            res.json(updatedVegetable);
        } else {
            res.status(404).json({ message: 'Vegetable not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new vegetable
// @route   POST /api/vegetables
const createVegetable = async (req, res) => {
    try {
        const { name, pricePerKg, image, description, category } = req.body;
        const vegetable = new Vegetable({
            name,
            pricePerKg,
            image,
            description,
            category
        });
        const createdVegetable = await vegetable.save();
        res.status(201).json(createdVegetable);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete vegetable
// @route   DELETE /api/vegetables/:id
const deleteVegetable = async (req, res) => {
    try {
        const vegetable = await Vegetable.findById(req.params.id);
        if (vegetable) {
            await Vegetable.deleteOne({ _id: req.params.id });
            res.json({ message: 'Vegetable removed' });
        } else {
            res.status(404).json({ message: 'Vegetable not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getVegetables,
    seedVegetables,
    updateVegetablePrice,
    createVegetable,
    deleteVegetable
};
