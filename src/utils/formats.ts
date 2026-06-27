const collapseLongString = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength).concat("...");
  } else {
    return text;
  }
};

const formatFirstAndLastName = (userName: string) => {
    const splittedName = userName.split(' ')
    const firstName = splittedName[0]
    const lastName = splittedName[splittedName.length -1]
    return firstName + " " + lastName
}

const getNameInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export { collapseLongString, formatFirstAndLastName, getNameInitials };
