const getPagination = (page = 1) => {
    const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
    const skip = (page - 1) * limit;
    return { limit, skip };
};

module.exports = { getPagination };
