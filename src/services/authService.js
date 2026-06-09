import { apiPost } from './apiClient';

export const authService = {
  changePassword({ currentPassword, newPassword, newPasswordConfirm }) {
    return apiPost('/v1/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
  },
};
