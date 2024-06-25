export interface User {
  id: number;
  name: string,
  user_avatar: string,
  first_name: string;
  last_name: string;
  account_type: string;
  valid_email: string;
  company_name: string;
  email_verified_at: string;
  email: string;
  $inertia: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
};

export interface PrevButtonProps {
  children: React.ReactNode;
  type: 'submit' | 'reset' | 'button' | undefined;
  handlePrev: CallableFunction;
}

export interface NextButtonProps {
  children: React.ReactNode;
  type: 'submit' | 'reset' | 'button' | undefined;
  handleNext: CallableFunction;
}

interface LogImgProps {
  name?: string | undefined;
}

interface DataProps {
  firstName: string | undefined;
  lastName: string | undefined;
  companyName: string | undefined;
  companyWebsite: string | undefined;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
  directPhoneNumber: string | undefined;
  agencySize: string | undefined;
  upfrontFee: string | undefined;
  extension: string | undefined;
  repAddress: string | undefined;
  repAddress2: string | undefined;
  repCity: string | undefined;
  repState: string | undefined;
  country: string | undefined;
  repZip: string | undefined;
  facebook: string | undefined;
  twitter: string | undefined;
  linkedin: string | undefined;
  github: string | undefined;
  whatsapp: string | undefined;
  portfolio: string | undefined;
  userAvatar: string | undefined;
  agencyType: string;
  yearsOfExperience: string;
  warehouseOffered: string;
  educationLevel: string;
  targetIndustries: string;
  //targetProspects: string;
  currentProductsSold: string;
  valueProposition: string;
  territories: string;
  compensationModel: number;
  headline: string;
  updatedAt: string | undefined;
  createdAt: string | undefined;
}

export interface CompanyDataProps {
  userAvatar: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  companyName: string | undefined;
  companyWebsite: string | undefined;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
  directPhoneNumber: string | undefined;
  extension: string | undefined;
  territory: string | undefined;
  targetProspect: string | undefined;
  productLine: string | undefined;
  companyAddress: string | undefined;
  companyAddress2: string | undefined;
  companyCity: string | undefined;
  companyState: string | undefined;
  country: string | undefined;
  companyZip: string | undefined;
  headline: string | undefined;
  productServices: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileInformationProps {
  setDatas: CallableFunction;
  errors: any;
  data: DataProps;
  viewProfile: CallableFunction;
}

export interface CompanyProfileInformationProps {
  setDatas: CallableFunction;
  errors: any;
  data: CompanyDataProps;
  viewProfile: CallableFunction;
}

export interface AddressInformationProps {
  setDatas: CallableFunction;
  errors: any;
  data: DataProps;
}

export interface CompanyAddressInformationProps {
  setDatas: CallableFunction;
  errors: any;
  data: CompanyDataProps;
}

export interface CardProps {
  title: string;
  icon: string;
  location: string;
  text: string;
}

export interface AddressProps {
  repAddress: string;
  repAddress2: string;
  repCity: string;
  repState: string;
  country: string;
  repZip: string;
}

export interface ContactInfoCardProps {
  name: string | undefined;
  icon: string;
  title: string;
}


export interface SocialMediaCardProps {
  text: string;
  name: string;
  title: string;
  imageLink: string;
  country: string;
}

export interface SocialMediaProps {
  facebook: string;
  twitter: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  portfolio: string;
  country: string;
}

export interface TopProfileProps {
  dateString: string;
  user: any;
  data: any;
  showEditProfile: CallableFunction;
  showMyPublicProfile: CallableFunction;
}

export interface ExperienceTabProps {
  activeTab: string;
  handleClick: CallableFunction;
}

export interface ManageTabItemProps {
  title: string;
  activeTab: string;
  handleClick: CallableFunction;
}

export interface ExperienceTabItemProps {
  title: string,
  icon: string,
  activeTab: string,
  handleClick: CallableFunction,
}

export interface ExperienceDataProps {
  agencyType: string;
  agencySize: string;
  yearsOfExperience: string;
  warehouseOffered: string;
  upfrontFee: string;
  educationLevel: string;
  targetIndustries: string;
  targetProspects: string;
  currentProductsSold: string;
  valueProposition: string;
  territories: string;
  compensationModel: number;
  headline: string;
}

interface ExperienceArrayProps {
  label: string;
  value: string;
}
export interface ExperienceProps {
  data: ExperienceDataProps;
  arrayWarehouseOffered: any;
  setDatas: CallableFunction;
  handleClick: CallableFunction;
  handleWarehouseOfferedChange: CallableFunction;
  arrayTargetIndustries: ExperienceArrayProps;
  arrayTargetCustomers: ExperienceArrayProps;
  arrayProductOptions: ExperienceArrayProps;
  handleTargetIndustriesChange: CallableFunction;
  handleTargetCustomersChange: CallableFunction;
  handleProductOptionsChange: CallableFunction;
}

export type Contacts = {
  id: number,
  title: string,
  text: string,
  icon: string,
  link: string
}

export type CompanyExperienceDataProps = {
  exclusiveTerritory: string,
  madInUsa: string,
  providedCrm: string,
  providedMarketingMaterials: string,
  providedTraining: string,
  companyRevenue: number,
  repBenefits: string,
  territory: string,
  headline: string,
}

export type BookmarkProps = {
  data: {
    id: number,
    user_account_id: number,
    user_avatar: string,
    company_name: string,
    product_line: string,
    provided_marketing_material: number,
    provided_crm: number,
    provided_training: number,
    created_at: string,
  }[]
}

export type RepsData = {
  id: number,
  user_account_id: number,
  first_name: string,
  last_name: string,
  email: string,
  rep_city: string | null,
  rep_state: string | null,
  country: string | null,
  current_products: string | null,
  company_name: string,
  password: string,
  created_at: string,
  login: string | null,
  company_city: string | null,
  company_state: string | null,
  email_address: string | null,
  product_line: string | null,
  user_avatar: string,
  account_type: string | null,
  plan_name: string | undefined,
}