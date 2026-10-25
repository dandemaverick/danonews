import {adminUser,authConfigured} from '../../../lib/admin';
export async function GET(){const user=await adminUser();return Response.json({configured:authConfigured(),signedIn:!!user,admin:!!user,name:user?.displayName},{headers:{'Cache-Control':'no-store'}})}
