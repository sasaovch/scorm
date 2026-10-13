import { useScorm } from '../scorm/ScormContext';

const STATUS_LABELS = {
  passed: 'Зачёт',
  failed: 'Не зачёт',
  incomplete: 'В процессе',
  'not attempted': 'Не начат',
};

export default function Progress() {
  const { rawScore, totalMaxPoints, passThreshold, lessonStatus } = useScorm();
  const percent = totalMaxPoints ? Math.min(100, Math.round((rawScore / totalMaxPoints) * 100)) : 0;
  const passPercent = Math.round((passThreshold / totalMaxPoints) * 100);

  return (
    <div className="progress" title={`Порог зачёта: ${passThreshold} баллов`}>
      <div className="progress__bar" aria-hidden="true">
        <div className="progress__fill" style={{ width: `${percent}%` }} />
        <div className="progress__mark" style={{ left: `${passPercent}%` }} />
      </div>
      <div className="progress__meta">
        <span className="progress__score">{rawScore} / {totalMaxPoints}</span>
        <span className={`progress__status progress__status--${lessonStatus}`}>
          {STATUS_LABELS[lessonStatus] ?? lessonStatus}
        </span>
      </div>
    </div>
  );
}
