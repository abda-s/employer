import { ADD_SKILL, DELETE_SKILL, EDIT_SKILL, ADD_EXPERIECE, DELETE_EXPERIECE, EDIT_EXPERIECE, ADD_EDUCATION, DELETE_EDUCATION, EDIT_EDUCATION, EDIT_PERSONALINFO, INIT_CV } from "./cvTypes"

export const initCV = (userId, fullName, phoneNumber, professionalSummary, skills, education, experience) => {
    return {
        type: INIT_CV,
        userId,
        fullName,
        phoneNumber,
        professionalSummary,
        skills,
        education,
        experience
    }
}

export const editPrsonalInfo = (fullName, phoneNumber, professionalSummary) => {
    return {
        type: EDIT_PERSONALINFO,
        fullName,
        phoneNumber,
        professionalSummary
    }
}

export const editEducation = (indexOfItem, institutionName, degree, graduationYear) => {
    return {
        type: EDIT_EDUCATION,
        indexOfItem,
        institutionName,
        degree,
        graduationYear
    }
}

export const addEduaction = (institutionName, degree, graduationYear) => {
    return {
        type: ADD_EDUCATION,
        institutionName,
        degree,
        graduationYear
    }
}

export const deletEducation = (indexofIem) => {
    return {
        type: DELETE_EDUCATION,
        indexofIem
    }
}



export const editExperience = (indexOfItem, jobTitle, companyName, description, startDate, endDate) => {
    return {
        type: EDIT_EXPERIECE,
        indexOfItem,
        jobTitle,
        companyName,
        description,
        startDate,
        endDate
    }
}

export const addExperience = (jobTitle, companyName, description, startDate, endDate) => {
    return {
        type: ADD_EXPERIECE,
        jobTitle,
        companyName,
        description,
        startDate,
        endDate
    }
}

export const deleteExperience = (indexofIem) => {
    return {
        type: DELETE_EXPERIECE,
        indexofIem
    }
}



export const editSkill = (indexOfItem, level) => {
    return {
        type: EDIT_SKILL,
        indexOfItem,
        level
    }
}

export const addSkill = (skillId, level) => {
    return {
        type: ADD_SKILL,
        skillId,
        level
    }
}

export const deleteSkill = (indexofIem) => {
    return {
        type: DELETE_SKILL,
        indexofIem
    }
}


