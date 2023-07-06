import Category from "../Models/category.js"
export const categoryHelper = async (categories) => {
    const category = []
    for(const cat of categories){
        const ctemp = await Category.findOne({name : cat})
        if(ctemp){
            category.push(ctemp._id)
        }else{
            const c1 = await Category.create({name : cat})
            category.push(c1._id) 
        }
    }
    return category
}