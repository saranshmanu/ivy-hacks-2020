export default function() {
	return [
		{
			title: 'Dashboard',
			to: '/dashboard',
			htmlBefore: '<i class="material-icons">edit</i>',
			htmlAfter: ''
		},
		{
			title: 'Distributor',
			htmlBefore: '<i class="material-icons">vertical_split</i>',
			to: '/distributor'
		},
		{
			title: 'Patient Profile',
			htmlBefore: '<i class="material-icons">note_add</i>',
			to: '/patient-profile'
		},
	];
}
