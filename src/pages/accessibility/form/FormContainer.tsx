import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ErrorText from './ErrorText';
import { FormPrivacy } from './FormPrivacy';
import FormStepper from './FormStepper';
import FormButton from './FormButton';
import styles from './FormContainer.module.scss';
import type React from 'react';

type FormStepStatus = 'input' | 'confirm' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  tel: string;
  topic: string;
  select: string;
  message: string;
  privacy: boolean;
}

export default function FormContainer() {
  const [status, setStatus] = useState<FormStepStatus>('input');
  const [formData, setFormData] = useState<FormValues | null>(null);
  const confirmMessageRef = useRef<HTMLParagraphElement>(null);
  const successMessageRef = useRef<HTMLParagraphElement>(null);
  const errorMessageRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      select: '',
      message: '',
      privacy: false,
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (status === 'confirm' && confirmMessageRef.current) {
      confirmMessageRef.current.focus();
    } else if (status === 'success' && successMessageRef.current) {
      successMessageRef.current.focus();
    } else if (status === 'error' && errorMessageRef.current) {
      errorMessageRef.current.focus();
    }
  }, [status]);

  const onConfirm = async () => {
    setFormData(getValues());
    setStatus('confirm');
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    try {
      // メール送信は実際には行わず、送信処理を擬似的に再現する
      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  return (
    <>
      {status === 'input' && (
        <>
          <FormStepper step="input" />
          <form onSubmit={handleSubmit(onConfirm)}>
            <div className={styles.formContainer}>
              <div className={styles.formRow}>
                <div className={styles.formLabel}>
                  <label htmlFor="name">
                    名前<span className={styles.required}>必須</span>
                  </label>
                </div>
                <div className={styles.formField}>
                  <input
                    {...register('name', { required: true })}
                    type="text"
                    id="name"
                    aria-describedby="name-error"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    className={errors.name ? styles.hasError : ''}
                    autoComplete="name"
                    required
                  />
                  {errors.name && (
                    <ErrorText
                      id="name-error"
                      message="名前を入力してください"
                    />
                  )}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formLabel}>
                  <label htmlFor="email">
                    メールアドレス
                    <span className={styles.required}>必須</span>
                  </label>
                </div>
                <div className={styles.formField}>
                  <input
                    {...register('email', {
                      required: 'メールアドレスを入力してください',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: '正しい形式でメールアドレスを入力してください',
                      },
                    })}
                    type="email"
                    id="email"
                    aria-describedby="email-error"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    className={errors.email ? styles.hasError : ''}
                    autoComplete="email"
                    required
                  />
                  {errors.email && (
                    <ErrorText
                      id="email-error"
                      message={errors.email.message ?? ''}
                    />
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formLabel}>
                  <label htmlFor="tel">電話番号</label>
                </div>
                <div className={styles.formField}>
                  <input
                    {...register('tel', {
                      pattern: {
                        value: /^[\d-]+$/,
                        message: '正しい形式で電話番号を入力してください',
                      },
                    })}
                    type="tel"
                    id="tel"
                    aria-describedby="tel-error"
                    aria-invalid={errors.tel ? 'true' : 'false'}
                    autoComplete="tel"
                  />
                  {errors.tel && (
                    <ErrorText
                      id="tel-error"
                      message={errors.tel.message ?? ''}
                    />
                  )}
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formLabel}>
                  <label htmlFor="select">選択</label>
                </div>
                <div className={styles.formField}>
                  <select {...register('select')} id="select">
                    <option value="">選択してください</option>
                    <option value="option1">オプション1</option>
                    <option value="option2">オプション2</option>
                    <option value="option3">オプション3</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formLabel}>
                  <label htmlFor="message">
                    お問い合わせ内容
                    <span className={styles.required}>必須</span>
                  </label>
                </div>
                <div className={styles.formField}>
                  <textarea
                    {...register('message', { required: true })}
                    id="message"
                    rows={5}
                    aria-describedby="message-error"
                    aria-invalid={errors.message ? 'true' : 'false'}
                    className={errors.message ? styles.hasError : ''}
                    required
                  />
                  {errors.message && (
                    <ErrorText
                      id="message-error"
                      message="お問い合わせ内容を入力してください"
                    />
                  )}
                </div>
              </div>
            </div>
            <FormPrivacy register={register} errors={errors} />
            <div className={styles.formButtonContainer}>
              <FormButton type="submit">入力内容を確認する</FormButton>
            </div>
          </form>
        </>
      )}
      {status === 'confirm' && (
        <>
          <FormStepper step="confirm" />
          <p
            className={styles.confirmMessage}
            ref={confirmMessageRef}
            tabIndex={-1}
          >
            入力内容を確認してください
          </p>
          <form onSubmit={onSubmit} className={styles.form}>
            <dl className={styles.formContainer}>
              <div className={styles.formRow}>
                <dt className={styles.formLabel}>名前</dt>
                <dd className={styles.formField}>{getValues('name')}</dd>
              </div>
              <div className={styles.formRow}>
                <dt className={styles.formLabel}>メールアドレス</dt>
                <dd className={styles.formField}>{getValues('email')}</dd>
              </div>
              <div className={styles.formRow}>
                <dt className={styles.formLabel}>電話番号</dt>
                <dd className={styles.formField}>{getValues('tel')}</dd>
              </div>
              <div className={styles.formRow}>
                <dt className={styles.formLabel}>選択</dt>
                <dd className={styles.formField}>{getValues('select')}</dd>
              </div>
              <div className={styles.formRow}>
                <dt className={styles.formLabel}>お問い合わせ内容</dt>
                <dd className={styles.formField}>{getValues('message')}</dd>
              </div>
              <div className={styles.formRow}>
                <dt className={styles.formLabel}>プライバシーポリシーの同意</dt>
                <dd className={styles.formField}>
                  {getValues('privacy') ? '同意する' : '同意しない'}
                </dd>
              </div>
            </dl>
            <div className={styles.formButtonContainer}>
              <FormButton
                type="button"
                onClick={() => {
                  setStatus('input');
                }}
              >
                入力画面に戻る
              </FormButton>
              <FormButton type="submit">送信する</FormButton>
            </div>
          </form>
        </>
      )}
      {status === 'success' && (
        <>
          <FormStepper step="success" />
          <p
            className={styles.successMessage}
            ref={successMessageRef}
            tabIndex={-1}
          >
            送信が完了しました
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <p
            className={styles.errorMessage}
            ref={errorMessageRef}
            tabIndex={-1}
          >
            送信に失敗しました
          </p>
        </>
      )}
    </>
  );
}
