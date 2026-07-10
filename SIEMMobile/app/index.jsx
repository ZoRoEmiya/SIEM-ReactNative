import { Redirect } from 'expo-router';
import LoadingBox from '../src/components/common/LoadingBox';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingBox message="Restoring session..." />;
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
