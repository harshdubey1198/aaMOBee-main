const Brand = require("../schemas/brand.schema");
const User = require("../schemas/user.schema");

const BrandServices = {};

// CREATE VENDOR
BrandServices.createBrand = async (userId, body) => {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("User not found");
  
    const { name, description, website, country, manufacturerId, firmId: manualFirmId } = body;
  
    const firmToUse = user.role === "client_admin" ? manualFirmId : user.adminId;
  
    if (!firmToUse) throw new Error("Firm ID is required");
  
    const existingBrand = await Brand.findOne({ name, firmId: firmToUse });
    if (existingBrand) throw new Error("Brand with this name already exists");
  
    const newBrand = new Brand({
      name,
      description,
      website,
      country,
      manufacturer: manufacturerId,
      createdBy: user._id,
      firmId: firmToUse
    });
  
    await newBrand.save();
    return newBrand;
  };
  

BrandServices.getBrands = async (firmId) => {
    const data = await Brand.find({ firmId: firmId, deleted_at: null });
    if(data.length === 0){
        throw new Error('No brands found for this Firm')
    }
    return data
}

BrandServices.getBrandById = async (brandId) => {
    const data = await Brand.findOne({_id: brandId, deleted_at: null})
    if(!data){
        throw new Error('No brands found')
    }
    return data
}

// UPDATE VENDOR
BrandServices.updateBrand = async (id, body) => {
    const existingBrand = await Brand.findOne({ _id: id, deleted_at: null });
        if (!existingBrand) {
        throw new Error('Vendor does not exist');
    }
    const updatedBrand = await Brand.findByIdAndUpdate(id, body, { new: true });
    return updatedBrand;
};

// DELETE VENDOR
BrandServices.deleteBrand = async (brandId) => {
    const existingBrand = await Brand.findOne({ _id: brandId, deleted_at: null });
    if (!existingBrand) {
        throw new Error('Vendor does not exist');
    }
    
    const deletedBrand = await Brand.findOneAndUpdate(
        {_id: brandId},
        {deleted_at: new Date()},
        {new: true}
    )
    if(!deletedBrand){
        throw new Error('unable to delete Brand')
    }
    return deletedBrand
}

module.exports = BrandServices