export const getDriveImageUrl = (driveUrl: string): string => {
  if (!driveUrl) return "";

  const match = driveUrl.match(/\/d\/(.+?)\/(view|edit|share|usp)?/);
  const fileId = match ? match[1] : driveUrl;
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};
