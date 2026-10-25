import { describe, expect, it } from 'vitest';
import { resources } from '../../translations';

const authKeys = ['authTabs','authSignInTab','authCreateTab','authSignInHeading','authCreateHeading','authTagline','authName','authNamePlaceholder','authEmail','authEmailPlaceholder','authPassword','authConfirmPassword','authForgot','authSignInButton','authCreateButton','authTryDemo','authConsent','authPrivacy','authFooter','authRequired','authInvalidEmail','authShortPassword','authPasswordMismatch','authConsentRequired','authEmailExists','authWrongCredentials','authStorageUnavailable','authTryAgain','authPasswordStrength','authStrengthWeak','authStrengthFair','authStrengthGood','authStrengthStrong','authShowPassword','authHidePassword','authWorking','authResetExplanation','authClose','authAccountLabel','authDemoAccount','authGuest','authSignOut','authDeleteAccount','authDeleteConfirm','authDeleted','authNameRequired'];

describe('authentication translations', () => {
  it('provides every auth screen string in English, Hindi, and Marathi', () => {
    for (const language of ['en','hi','mr'] as const) {
      const translation = resources[language].translation as Record<string, unknown>;
      for (const key of authKeys) expect(translation[key], `${language}:${key}`).toBeTruthy();
    }
  });
});
