import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatRelativeTime = (dateString: string): string => {
	return formatDistanceToNow(new Date(dateString), { locale: ru }) + ' назад';
};
