// src/data/foodCatalog.js
// This is the updated version with 'calories' for each item.
export const foodCatalog = {
  grains: [
    { id: 'g1', name: 'Roti / Chapati', calories: 120, tags: ['Fiber', 'Carbohydrate'], note: 'Whole wheat is best.' },
    { id: 'g2', name: 'Rice (1 cup)', calories: 200, tags: ['Carbohydrate', 'Easy to Digest'], note: 'Brown rice has more fiber.' },
    { id: 'g3', name: 'Idli (1 piece)', calories: 40, tags: ['Fermented', 'Easy to Digest'], note: 'Good for breakfast.' },
    { id: 'g4', name: 'Dosa (1 medium)', calories: 130, tags: ['Fermented', 'Carbohydrate'], note: 'Can be made healthier with less oil.' },
    { id: 'g5', name: 'Rice (White)', calories: 200, tags: ['Carbohydrate'], note: 'Simple and easy to digest.'},
    { id: 'g6', name: 'Idli', calories: 40, tags: ['Fermented'], note: 'Good for breakfast.'}
  ],
  lentils: [
    { id: 'l1', name: 'Dal (1 cup)', calories: 230, tags: ['Protein', 'Fiber'], note: 'A staple for protein intake.' },
    { id: 'l2', name: 'Moong Dal (1 cup)', calories: 210, tags: ['Protein', 'Easy to Digest'], note: 'Often recommended when feeling unwell.' },
    { id: 'l3', name: 'Sambar (1 cup)', calories: 150, tags: ['Protein', 'Vegetables'], note: 'A nutritious mix of lentils and veggies.' },
    { id: 'l4', name: 'Sambar', calories: 150, tags: ['Protein', 'Vegetables'], note: 'A nutritious mix of lentils and veggies.'}
  ],
  vegetables: [
    { id: 'v1', name: 'Mixed Sabzi (1 cup)', calories: 100, tags: ['Vitamins', 'Fiber'], note: 'Eat a variety of colors.' },
    { id: 'v2', name: 'Palak (Spinach)', calories: 80, tags: ['Iron', 'Vitamins'], note: 'Excellent source of iron.' },
    { id: 'v3', name: 'Bhindi (Okra)', calories: 90, tags: ['Fiber'], note: 'Good for digestion.' },
  ],
  dairy: [
    { id: 'd1', name: 'Curd / Dahi (1 cup)', calories: 100, tags: ['Probiotic', 'Calcium'], note: 'Aids digestion and cools the body.' },
    { id: 'd2', name: 'Paneer (100g)', calories: 265, tags: ['Protein', 'Calcium'], note: 'Good source of protein for vegetarians.' },
    { id: 'd3', name: 'Milk (1 glass)', calories: 150, tags: ['Calcium', 'Vitamin D'], note: 'Important for bone health.' },
  ],
  fruits: [
      { id: 'f1', name: 'Banana (1)', calories: 105, tags: ['Potassium', 'Energy'], note: 'Easy to eat and digest.' },
      { id: 'f2', name: 'Apple (1)', calories: 95, tags: ['Fiber', 'Vitamins'], note: 'Good for heart health.' },
      { id: 'f3', name: 'Papaya (1 cup)', calories: 60, tags: ['Digestion', 'Vitamin C'], note: 'Excellent for digestive health.' },
  ],
};