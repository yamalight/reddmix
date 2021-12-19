const getAwardUrl = (award) => {
  const urlSixteen = award.resized_icons.find((i) => i.width === 16).url;
  if (urlSixteen) {
    return urlSixteen.replace(/&amp;/g, '&');
  }

  const url = award.resized_icons.find((i) => i.width === 32).url;
  if (url) {
    return url.replace(/&amp;/g, '&');
  }

  return award.icon_url;
};

export default function Awards({ awards }) {
  return (
    <div className="ml-2 flex items-center gap-2 text-gray-900 dark:text-gray-400">
      {awards.map((award) => (
        <div className="flex items-center" key={award.id}>
          <img className="w-4 h-4" src={getAwardUrl(award)} alt={award.name} />{' '}
          {award.count > 1 && <>{award.count}</>}
        </div>
      ))}
    </div>
  );
}
