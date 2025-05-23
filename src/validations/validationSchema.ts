import * as yup from 'yup';

const isValidCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder: number;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cpf.charAt(9)) !== digit1) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(cpf.charAt(10)) === digit2;
};

export const registerSchema = yup.object().shape({
  username: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  birth_date: yup.string().required('Data de nascimento é obrigatória'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .transform(value => value?.replace(/\D/g, ''))
    .test('is-valid-cpf', 'CPF inválido', (value) => isValidCPF(value || '')),
  phone: yup
    .string()
    .required('Telefone é obrigatório')
    .transform(value => value?.replace(/\D/g, ''))
    .min(10, 'Telefone inválido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .test(
      'is-strong',
      'A senha deve ter pelo menos:\n- 8 caracteres\n- 1 letra maiúscula\n- 1 caractere especial',
      (value) =>
        (value?.length ?? 0) >= 8 &&
        /[A-Z]/.test(value ?? '') &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value ?? '')
    ),
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'Senhas não são idênticas'),
});

export const loginSchema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    password: yup
        .string()
        .required('Senha é obrigatória')
    // .matches(
    //     /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
    //     'A senha deve ter pelo menos:\n8 caracteres\n1 letra maiúscula\n1 caractere especial'
    // ),
});


export type RegisterFormData = yup.InferType<typeof registerSchema>;
