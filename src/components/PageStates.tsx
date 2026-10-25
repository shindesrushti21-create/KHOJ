import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function EmptyState({ icon: Icon, title, description, action, media }: { icon: LucideIcon; title: string; description: string; action?: ReactNode; media?: ReactNode }) {
  return <div className="empty page-empty">{media}<div className="page-empty-copy"><Icon aria-hidden="true"/><h2>{title}</h2><p>{description}</p>{action}</div></div>;
}

export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();
  return <div className="thread-loading" role="status" aria-label={label || t('loading')} aria-busy="true"><span/><span/><span/></div>;
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return <div className="empty page-error" role="alert"><AlertCircle aria-hidden="true"/><h2>{t('pageErrorTitle')}</h2><p>{t('pageErrorBody')}</p><button className="button primary" type="button" onClick={onRetry}>{t('retry')}</button></div>;
}

export function InsufficientData({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  return <p className="insufficient-data"><span aria-hidden="true">·</span>{children || t('insufficientData')}</p>;
}

export function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation();
  return <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={16} aria-hidden="true"/><span>{message}</span><button type="button" onClick={onDismiss} aria-label={t('dismiss')}><span aria-hidden="true">×</span></button></div>;
}

type BoundaryProps = { children: ReactNode };
type BoundaryState = { failed: boolean };
export class PageErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };
  static getDerivedStateFromError(): BoundaryState { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Page rendering failed', error, info.componentStack); }
  render() { return this.state.failed ? <ErrorState onRetry={() => this.setState({ failed: false })}/> : this.props.children; }
}
