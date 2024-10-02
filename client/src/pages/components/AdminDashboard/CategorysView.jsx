import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverURL } from '../../../constants'
import { useSelector } from 'react-redux'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Box, Button } from "@mui/material";
import Category from './Category';
import AddCategoryModal from './AddCategoryModal';
import UncategorizedSkills from './UncategorizedSkills';
function CategorysView() {
    const accessToken = useSelector(state => state.auth.token)
    const [data, setData] = useState([])
    const [addCatIsVisible, setAddCatIsVisible] = useState(false)

    const [toRefreshFetch, setToRefreshFetch] = useState(null)


    useEffect(() => {
        axios.get(`${serverURL}/skills/categories-with-skills`, { headers: { accessToken } })
            .then(res => {
                setData(res.data)
            })
            .catch(err => {
                console.log(err.data);

            })
    }, [toRefreshFetch])


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

                    {data?.map((item, index) => (
                        item.category.name === "Uncategorized" ? (
                            item.skills.length > 0 && (
                                <UncategorizedSkills
                                    data={data}
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