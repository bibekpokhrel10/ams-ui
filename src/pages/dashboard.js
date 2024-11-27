import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CircularProgress, Alert } from '@mui/material';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  GraduationCap,
  User,
  BookOpen as ClassIcon
} from 'lucide-react';
import { fetchDashboardData } from '../action/dashboard';

const StyledContainer = ({ children }) => (
  <div className="min-h-screen bg-[#F8DEF5] bg-opacity-30 p-8">
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-gray-600 text-sm font-medium">
        {title}
      </p>
      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
    <div className="bg-pink-100 rounded-xl p-3">
      <Icon className="w-6 h-6 text-pink-600" />
    </div>
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="w-full bg-pink-100 rounded-full h-2">
    <div 
      className="bg-pink-600 h-2 rounded-full transition-all duration-300" 
      style={{ width: `${value}%` }}
    />
  </div>
);

export const Dashboard = ({ userType = 'super_admin' }) => {
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchDashboardData({userType}));
        if (response.success) {
          setDashboardData(response.data);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch dashboard data');
          setDashboardData(null);
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [dispatch, userType]);

  const renderStats = (stats, icons) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(stats).map(([key, value], index) => (
        <StatCard
          key={key}
          title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          value={typeof value === 'number' && key.toLowerCase().includes('attendance') 
            ? `${value}%` 
            : value}
          icon={icons[index]}
        />
      ))}
    </div>
  );

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <CircularProgress sx={{ color: '#C215AE' }} />
        </div>
      );
    }

    if (error) {
      return (
        <Alert severity="error" className="mt-4">
          {error}
        </Alert>
      );
    }

    if (!dashboardData || !dashboardData[userType]) {
      return (
        <Alert severity="info" className="mt-4">
          No data available for this user type
        </Alert>
      );
    }

    const userData = dashboardData[userType];

    switch (userType) {
      case 'super_admin':
        return (
          <>
            {renderStats(userData.stats, [
              GraduationCap,
              Users,
              User,
              BookOpen
            ])}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">
                  Institutions Overview
                </h2>
                {userData.institutionsList?.map((inst) => (
                  <div key={inst.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">{inst.name}</p>
                      <p className="text-sm font-medium text-pink-600">
                        {inst.attendance}%
                      </p>
                    </div>
                    <ProgressBar value={inst.attendance} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'institution_admin':
        return (
          <>
            {renderStats(userData.stats, [
              Users,
              User,
              BookOpen,
              Calendar
            ])}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">
                  Monthly Attendance Trends
                </h2>
                {userData.attendanceTrends?.map((month) => (
                  <div key={month.month} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">{month.month}</p>
                      <p className="text-sm font-medium text-pink-600">
                        {month.attendance}%
                      </p>
                    </div>
                    <ProgressBar value={month.attendance} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'program_admin':
        return (
          <>
            {renderStats(userData.stats, [
              Users,
              BookOpen,
              Calendar
            ])}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">
                  Semester Overview
                </h2>
                {userData.semesterData?.map((sem) => (
                  <div key={sem.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">{sem.name}</p>
                      <p className="text-sm font-medium text-pink-600">
                        {sem.attendance}%
                      </p>
                    </div>
                    <ProgressBar value={sem.attendance} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'teacher':
        return (
          <>
            {renderStats(userData.stats, [
             ClassIcon,
             Users,
             Calendar
            ])}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">
                  Class Overview
                </h2>
                {userData.classes?.map((cls) => (
                  <div key={cls.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">
                        {cls.name} ({cls.students} students)
                      </p>
                      <p className="text-sm font-medium text-pink-600">
                        {cls.attendance}%
                      </p>
                    </div>
                    <ProgressBar value={cls.attendance} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'student':
        return (
          <>
            {renderStats(userData.stats, [
             BookOpen,
             Calendar,
             GraduationCap
            ])}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6">
                  Course Performance
                </h2>
                {userData.courses?.map((course) => (
                  <div key={course.name} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">
                        {course.name} (Grade: {course.grade})
                      </p>
                      <p className="text-sm font-medium text-pink-600">
                        {course.attendance}%
                      </p>
                    </div>
                    <ProgressBar value={course.attendance} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return (
          <Alert severity="warning" className="mt-4">
            Invalid user type specified
          </Alert>
        );
    }
  };

  return (
    <StyledContainer>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">
          Dashboard Overview
        </h1>
        {renderDashboardContent()}
      </div>
    </StyledContainer>
  );
};

export default Dashboard;