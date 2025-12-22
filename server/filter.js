// const customerFilter  = (searchQuery) => {
//     if(!searchQuery){
//         throw new Error('Search query is Required')
//     }

//     return {
//         $or: [
//             { firstName: { $regex: searchQuery, $options: "i" } },
//             { email: { $regex: searchQuery, $options: "i" } },
//         ],
//     }
// }

// module.exports = { customerFilter }

module.exports = {
  buildFilter: (data) => {
    const filterObj = {};

    if (data.keyword) {
      const keyword = data.keyword;

      filterObj.$or = [
        // 1. Match first name starting with keyword (highest priority)
        { firstName: { $regex: `^${keyword}`, $options: "i" } },

        // 2. Match last name starting with keyword (secondary priority)
        { lastName: { $regex: `^${keyword}`, $options: "i" } },

        // 3. Match email containing keyword
        { email: { $regex: keyword, $options: "i" } }
      ];
    }

    return filterObj;
  },
};



  