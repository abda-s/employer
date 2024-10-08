import React, { useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Box, Button, CircularProgress } from "@mui/material";
import Category from './Category';
import AddCategoryModal from './AddCategoryModal';
import UncategorizedSkills from './UncategorizedSkills';
import { useAxios } from '../../hooks/useAxios';
function CategorysView() {
    const [addCatIsVisible, setAddCatIsVisible] = useState(false)
    const [toRefreshFetch, setToRefreshFetch] = useState(null)


    const { response: categoryData, isLoading } = useAxios({
        url: `/skills/categories-with-skills`,
        method: 'GET',
        dependencies: [toRefreshFetch]
    })

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Box>
                <Button
                    variant='contained'
                    onClick={() => {
                        setAddCatIsVisible(true)
                    }}
                >
                    Add Category
                </Button>

                <AddCategoryModal
                    isVisible={addCatIsVisible}
                    onClose={() => { setAddCatIsVisible(false); }}
                    setToRefreshFetch={e => setToRefreshFetch(e)}
                />
            </Box>
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                <Masonry>

                    {categoryData?.map((item, index) => (
                        item.category.name === "Uncategorized" ? (
                            item.skills.length > 0 && (
                                <UncategorizedSkills
                                    data={categoryData}
                                    key={index}
                                    item={item}
                                    index={index}
                                    setToRefreshFetch={(e) => setToRefreshFetch(e)}
                                />
                            )
                        ) : (
                            <Category
                                key={index}
                                item={item}
                                index={index}
                                setToRefreshFetch={setToRefreshFetch}
                            />
                        )
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </Box>
    )
}

export default CategorysView