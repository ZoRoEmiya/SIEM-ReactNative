import { Redirect } from 'expo-router';
import LoadingBox from '../src/components/common/LoadingBox';
import { useAuth } from '../src/context/AuthContext';
import { useLanguage } from '../src/context/LanguageContext';
import i18n from '../src/localization/i18n';

export default function Index() {
  const { user, isLoading } = useAuth();
  useLanguage();

  if (isLoading) {
    return <LoadingBox message={i18n.t('navigationRestoringSession')} />;
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
