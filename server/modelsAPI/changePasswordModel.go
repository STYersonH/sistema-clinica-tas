package modelsApi

type ChangePassword struct {
	IdCuenta           int
	ActualPassword     string
	NewPassword        string
	ConfirmNewPassword string
}
