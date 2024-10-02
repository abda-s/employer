import React, { useState } from 'react'
import { Box, Card, Typography, IconButton, Button } from "@mui/material";
import EditCategoryModal from './EditCategoryModal';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import axios from 'axios';
import { serverURL } from '../../../constants';
import { useSelector } from 'react-redux';


function Category({ item, index, setToRefreshFetch }) {
    const [isEditCategoryVisible, setIsEditCategoryVisible] = useState(false)

    const accessToken = useSelector(state => state.auth.token)

    const hendelDelete = (id) => {
        axios.delete(`${serverURL}/skills/delete-category/${id}`, { headers: { accessToken } })
            .then(res => {
                setToRefreshFetch(res.data)

            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Card key={index} sx={{ padding: 2, margin: 2, textTransform: "capitalize" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }} >
                <Typography variant="h6">{item?.category?.name}</Typography>

                <Box>
                    <IconButton
                        onClick={() => {
                            hendelDelete(item?.category?._id)
                        }}
                    >
                        <DeleteRoundedIcon
                            sx={{ fontSize: "20px" }}
                        />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            setIsEditCategoryVisible(true)
                        }}
                    >
                        <EditRoundedIcon
                            color='primary'
                            sx={{ fontSize: "20px" }}
                        />
                    </IconButton>
                </Box>

            </Box>
            <hr />
            {item?.skills?.map((skill, i) => (
                <Box
                    component="span"
                    key={i}
                    sx={{
                        m: 1,
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5",
                    }}
                >
                    {skill.name}
                </Box>
            ))}
            <EditCategoryModal
                category={item?.category}
                skillsList={item?.skills}
                isVisible={isEditCategoryVisible}
                onClose={() => { setIsEditCategoryVisible(false); }}
                setToRefreshFetch={e => setToRefreshFetch(e)}
            />

        </Card>)
}

export default Category