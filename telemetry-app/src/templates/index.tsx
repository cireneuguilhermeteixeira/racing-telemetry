import { ReactElement } from 'react';
import BasicRpmDashboard from '../pannels/basic_rpm_dashboard/BasicRpmDashboard';
import CivicG10Dashboard from '../pannels/civic_g10_dashboard/CivicG10Dashboard';


interface Template {
  id: string,
  name: string,
  component: ReactElement
}

const templates : Array<Template> = [
  { id: '1', name: 'Basic RPM Pannel', component: <BasicRpmDashboard /> },
  { id: '2', name: 'Honda Civic G10', component: <CivicG10Dashboard/> }
  // Add more templates here
];


export default templates;