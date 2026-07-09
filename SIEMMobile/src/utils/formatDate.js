export const formatDateTime = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
