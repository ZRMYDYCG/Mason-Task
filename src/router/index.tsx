import { useRoutes } from 'react-router'
import Login from '@/pages/login'
import Layouts from '@/layouts'
import Workbench from '@/pages/workbench'
import Register from '@/pages/register'
import File from '@/pages/file'
import Calendar from '@/pages/calendar'
import Project from '@/pages/project'
import Dir from '@/pages/dir'
import Message from '@/pages/message'

const Routes = () => {
  return useRoutes([
    {
      path: '/',
      element: <Layouts />,
      children: [
        {
          path: '/',
          element: <Workbench />,
        },
        {
          path: '/file',
          element: <File />,
        },
        {
          path: 'message',
          element: <Message />,
        },
        {
          path: '/file/dir',
          element: <Dir />,
        },
        {
          path: '/calendar',
          element: <Calendar />,
        },
        {
          path: '/project',
          element: <Project />,
        },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
  ])
}

export default Routes
