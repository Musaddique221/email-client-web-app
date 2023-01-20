const filterList = (data, filterList) => {
  if (filterList.length) {
    const FilteredData = data.filter((item) => {
      if (filterList.includes("read") && item.read) {
        return true;
      } else if (filterList.includes("unread") && !item.read) {
        return true;
      } else if (filterList.includes("favorite") && item.favorite) {
        return true;
      } else return false;
    });
    return FilteredData;
  } else return data;
};

export { filterList };
