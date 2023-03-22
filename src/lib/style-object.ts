export const camelCaseToDash = (obj: Record<string, string | undefined>) => {
	return Object.keys(obj).reduce((pre, cur) => {
    if (obj[cur] === undefined) {
      return pre;
    }
		const dashKey = cur.replaceAll(/[A-W]/g, ($0) => `-${$0.toLocaleLowerCase()}`);
		return pre + `;${dashKey}: ${obj[cur]}`;
	}, '');
};
