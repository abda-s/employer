import { 
    ADD_SKILL, 
    DELETE_SKILL, 
    EDIT_SKILL, 
    ADD_EXPERIECE, 
    DELETE_EXPERIECE, 
    EDIT_EXPERIECE, 
    ADD_EDUCATION, 
    DELETE_EDUCATION, 
    EDIT_EDUCATION, 
    EDIT_PERSONALINFO, 
    INIT_CV
 } from "./cvTypes"

const initalCVState = {
    userId: null,
    fullName: null,
    phoneNumber: null,
    professionalSummary: null,
    employeeSkills: null,
    education: null,
    experience: null,
}

const cvReducer = (state = initalCVState, action) => {
    switch (action.type) {
        case INIT_CV: return {
            userId: action.userId,
            fullName: action.fullName,
            phoneNumber: action.phoneNumber,
            professionalSummary: action.professionalSummary,
            employeeSkills: action.skills,
            education: action.education,
            experience: action.experience,
        }
        case EDIT_PERSONALINFO: return {
            ...state,
            fullName: action.fullName,
            phoneNumber: action.phoneNumber,
            professionalSummary: action.professionalSummary
        }
        case EDIT_EDUCATION: return {
            ...state,
            education: state.education.map((item, index) =>
                index === action.indexOfItem
                    ? {
                        ...item,
                        institutionName: action.institutionName,
                        degree: action.degree,
                        graduationYear: action.graduationYear
                    }
                    : item
            )
        }
        case ADD_EDUCATION: return {
            ...state,
            education: [
                ...state.education,
                {
                    institutionName: action.institutionName,
                    degree: action.degree,
                    graduationYear: action.graduationYear
                }
            ]
        }
        case DELETE_EDUCATION: return {
            ...state,
            education: state.education.filter((_, index) => index !== action.indexofIem)
        }
        case EDIT_EXPERIECE: return {
            ...state,
            experience: state.experience.map((item, index) =>
                index === action.indexOfItem
                    ? {
                        ...item,
                        jobTitle: action.jobTitle,
                        companyName: action.companyName,
                        description: action.description,
                        startDate: action.startDate,
                        endDate: action.endDate
                    }
                    : item
            )
        }
        case ADD_EXPERIECE: return {
            ...state,
            experience: [
                ...state.experience,
                {
                    jobTitle: action.jobTitle,
                    companyName: action.companyName,
                    description: action.description,
                    startDate: action.startDate,
                    endDate: action.endDate
                }
            ]
        }
        case DELETE_EXPERIECE: return {
            ...state,
            experience: state.experience.filter((_, index) => index !== action.indexofIem)
        }
        case EDIT_SKILL: return {
            ...state,
            employeeSkills: state.employeeSkills.map((item, index) =>
                index === action.indexOfItem
                    ? {
                        ...item,
                        level: action.level,
                    }
                    : item
            )
        }
        case ADD_SKILL: return {
            ...state,
            employeeSkills: [
                ...state.employeeSkills,
                {
                    skillId: action.skillId,
                    level: action.level,
                }
            ]
        }
        case DELETE_SKILL: return {
            ...state,
            employeeSkills: state.employeeSkills.filter((_, index) => index !== action.indexofIem)
        }
        default: return state
    }
}

export default cvReducer