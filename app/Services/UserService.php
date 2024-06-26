<?php

namespace App\Services;

use App\Models\UserAddress;
use Illuminate\Support\Collection;
use App\Repositories\UserRepository;

class UserService
{
    protected $user;

    /**
     * Class constructor
     */
    public function __construct(UserRepository $user)
    {
        $this->user = $user;
    }

    /**
     * Method to get user data based on
     * @param array $data data of the users
     * @return UserAddress
     */
    public function create(array $data)
    {
        return $this->user->create($data);
    }

    /**
     * Method to get user data based on
     * @param int $id unique ID of the users
     * @return Collection
     */
    public function get(int $id)
    {
        return $this->user->get($id);
    }

    /**
     * Method to get user data based on
     * @param string $email email address of the users
     * @return Collection
     */
    public function getByEmail(String $email)
    {
        return $this->user->getByEmail($email);
    }



    /**
     * Method to update user data based on
     * @param int $id unique ID of the users
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        return $this->user->update($id, $data);
    }

    /**
     * Method to remove user data based on
     * @param int $id unique ID of the users
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        return $this->user->delete($id);
    }
}
