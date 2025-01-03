import axios from "axios";

export const userLogin = (loginUserPayload) => {
  const loginUser = axios.post(`${process.env.REACT_APP_API}/login`, loginUserPayload);
  return loginUser;
};

export const registerUser = (registerUserPayload) => {
  const registerUser = axios.post(`${process.env.REACT_APP_API}/register`, registerUserPayload);
  return registerUser;
};

export const getAttendance = (token) => {
  const attendanceUser = axios.get(`${process.env.REACT_APP_API}/attendances`, {headers: {"Authorization": `bearer ${token}`}});
  return attendanceUser;
};

export const getInstitutions = (token, listInsitutionPayload) => {
  return axios.get(`${process.env.REACT_APP_API}/institutions`, { params: listInsitutionPayload,
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createInstution = (institutionData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/institutions`, institutionData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteInstution = (institutionId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/institutions/${institutionId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getUserProfileAPI = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/users/profile`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getNotifications = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/notifications`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const markNotificationAsRead = (notificationId, token) => {
  return axios.put(`${process.env.REACT_APP_API}/notifications/${notificationId}`, {}, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getUsersAPI = (token, listRequest) => {
  return axios.get(`${process.env.REACT_APP_API}/users`, {params: listRequest,
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteUserAPI = (userId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/users/${userId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateUserTypeAPI = (userId, updateUserTypePayload, token) => {
  return axios.put(`${process.env.REACT_APP_API}/users/${userId}/change-type`, updateUserTypePayload, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateUserPasswordAPI = (userId ,updateUserPasswordPayload, token) => {
  return axios.put(`${process.env.REACT_APP_API}/users/${userId}/change-password`, updateUserPasswordPayload, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateUserprofileAPI = (userId, updateUserprofilePayload, token) => {
  return axios.put(`${process.env.REACT_APP_API}/users/${userId}/activate`, updateUserprofilePayload, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createProgramAPI = (programData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/programs`, programData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getProgramsAPI = (institutionId, listProgramPayload,token) => {
  return axios.get(`${process.env.REACT_APP_API}/programs`, { params: listProgramPayload, params: { institution_id: institutionId },
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateProgramAPI = (programId, programData, token) => {
  return axios.put(`${process.env.REACT_APP_API}/programs/${programId}?institution_id=${programData.institution_id}`, programData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteProgramAPI = (programId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/programs/${programId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createSemesterAPI = (semesterData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/semesters`, semesterData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getSemestersAPI = (programId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/semesters?program_id=${programId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateSemesterAPI = (semesterId, semesterData, token) => {
  return axios.put(`${process.env.REACT_APP_API}/semesters/${semesterId}`, semesterData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteSemesterAPI = (semesterId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/semesters/${semesterId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createCourseAPI = (courseData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/courses`, courseData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getCoursesAPI = (semesterId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/courses?semester_id=${semesterId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateCourseAPI = (courseId, courseData, token) => {
  return axios.put(`${process.env.REACT_APP_API}/courses/${courseId}`, courseData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteCourseAPI = (courseId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/courses/${courseId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createClassAPI = (classData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/classes`, classData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getClassesAPI = (courseId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/classes?course_id=${courseId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateClassAPI = (classId, classData, token) => {
  return axios.put(`${process.env.REACT_APP_API}/classes/${classId}`, classData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteClassAPI = (classId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/classes/${classId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getInstructorsAPI = (institutionId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/users?user_type=teacher&institution_id=${institutionId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

// Fetch classes for attendance
export const fetchClassesAPI = (institutionId, teacherId, token) => {
  let url = `${process.env.REACT_APP_API}/classes`;
  
  // Add query parameters if provided
  if (institutionId) {
    url += `?institution_id=${institutionId}`;
  }
  if (teacherId) {
    url += institutionId ? `&teacher_id=${teacherId}` : `?teacher_id=${teacherId}`;
  }
  
  return axios.get(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
};

// Take attendance for a class
export const takeAttendanceAPI = (attendanceData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/attendances`, attendanceData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
};

// Update existing attendance record
export const updateAttendanceAPI = (attendanceId, attendanceData, token) => {
  return axios.put(`${process.env.REACT_APP_API}/attendances/${attendanceId}`, attendanceData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
};

// Fetch attendance history for a class
export const fetchAttendanceHistoryAPI = (query, token) => {
  let url = `${process.env.REACT_APP_API}/attendances`;
  
  return axios.get(url, {
    params: query ,
    headers: { "Authorization": `Bearer ${token}` }
  });
};

// Get student attendance statistics
export const getAttendanceStatsAPI = (query, token) => {
  return axios.get(`${process.env.REACT_APP_API}/attendances/stats`, {
    params: query,
    headers: { "Authorization": `Bearer ${token}` }
  });
};

// Bulk update attendance
export const bulkUpdateAttendanceAPI = (attendanceData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/attendance/bulk`, attendanceData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
};


export const getEnrolledStudentsAPI = (programId, params, token) => {
  return axios.get(
    `${process.env.REACT_APP_API}/programs/enrollments`, 
    {
      params: {
        page: params.page,
        size: params.size,
        sort_column: params.sort_column,
        sort_direction: params.sort_direction,
        query: params.query,
        program_id: programId,
        is_class_enrollment: params.is_class_enrollment,
        class_id: params.class_id
      },
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};

export const enrollStudentsAPI = (programId, studentIds, token) => {
  console.log("program id :: ", programId, "student id :: ", studentIds);
  return axios.post(
    `${process.env.REACT_APP_API}/programs/enrollments`,
    { 
      student_ids: studentIds,
      program_id: programId
     },
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};


export const unenrollStudentAPI = (programId, studentId, token) => {
  return axios.delete(
    `${process.env.REACT_APP_API}/programs/enrollments/${studentId}`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};

export const searchAvailableStudentsAPI = (query, token) => {
  return axios.get(
    `${process.env.REACT_APP_API}/students/available`,
    {
      params: { query },
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};

export const getInstitutionUserAPI = (query, token) => {
  return axios.get(
    `${process.env.REACT_APP_API}/users`,
    {
      params: query,
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
}

// Optional: If you need batch operations
export const batchEnrollStudentsAPI = (programId, enrollmentData, token) => {
  return axios.post(
    `${process.env.REACT_APP_API}/programs/${programId}/enrollments/batch`,
    enrollmentData,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};

// Optional: If you need to get enrollment details
export const getEnrollmentDetailsAPI = (programId, studentId, token) => {
  return axios.get(
    `${process.env.REACT_APP_API}/programs/${programId}/enrollments/${studentId}`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};

// Optional: If you need to update enrollment status
export const updateEnrollmentStatusAPI = (programId, studentId, statusData, token) => {
  return axios.patch(
    `${process.env.REACT_APP_API}/programs/${programId}/enrollments/${studentId}/status`,
    statusData,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
};

export const fetchEnrolledStudents = (programId, token) => {
  return axios.get(
    `${process.env.REACT_APP_API}/programs/${programId}/enrollments`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
}

export const enrollClassStudentsAPI = (classId, studentIds, token) => {
  return axios.post(
    `${process.env.REACT_APP_API}/classes/enrollments`,
    { student_ids: studentIds,
      class_id: classId,
     },
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
}


export const unenrollClassStudentAPI = (studentId, token) => {
  return axios.delete(
    `${process.env.REACT_APP_API}/classes/enrollments/${studentId}`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
}

export const getClassEnrolledStudentsAPI = (classId, params, token) => {
  return axios.get(
    `${process.env.REACT_APP_API}/classes/enrollments`,
    {
      params: {
        class_id: classId
      },
     params,
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
}


export const getInstructorClassesAPI = (instructorId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/classes?instructor_id=${instructorId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getClassStudentsAPI = (query, token) => {
  console.log("query :: ", query);
  return axios.get(`${process.env.REACT_APP_API}/classes/enrollments`, {
    params: query,
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const getDashboardData = async (token, query) => {
  const response = await axios.get(`${process.env.REACT_APP_API}/dashboard`, {
    params: query,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

export const getInstitutionAdminsAPI = (institutionId, query, token) => {
  return axios.get(`${process.env.REACT_APP_API}/institution-admins`, {
    params: {
      institution_id: institutionId,
      ...query
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addInstitutionAdminAPI = (institutionId, userId, token) => {
  return axios.post(`${process.env.REACT_APP_API}/institution-admins`, {
    institution_id: institutionId,
    user_id: userId
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getTeacherClassAttendanceAPI = (classId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/attendances/class/${classId}/teachers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getStudentClassAttendanceAPI = (classId, token) => {
  return axios.get(`${process.env.REACT_APP_API}/attendances/class/${classId}/students`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendAttendanceAlertAPI = (user_type,threshold, token) => {
  return axios.post(`${process.env.REACT_APP_API}/attendances/send-alerts`, {
    user_type: user_type,
    threshold: threshold
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  });
};

