<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Repositories\BlotterRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use PhpParser\Node\Expr\Cast\Object_;

class BlotterService
{
    protected $blotter;

    /**
     * Class constructor
     */
    public function __construct(BlotterRepository $blotter)
    {
        $this->blotter = $blotter;
    }

    /**
     * Method to get latest blotter data based on
     * @param int $userId Barangay user ID
     * @return \App\Models\Blotter
     */
    public function getLatest(Int $userId)
    {
        return $this->blotter->getLatest($userId);
    }

    /**
     * Method to get blotter data based on
     * @param int $id unique ID of the blotters
     * @return Collection
     */
    public function get(int $id)
    {
        return $this->blotter->get($id);
    }


    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     * @param int $userId User ID
     * @return \App\Models\Blotter
     */
    public function create(Request $request, Int $userId)
    {
        return $this->blotter->create($request, $userId);
    }


    /**
     * Method to update blotter data based on
     * @param int $id unique ID of the blotters
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        return $this->blotter->update($id, $data);
    }

    /**
     * Method to remove blotter data based on
     * @param int $id unique ID of the blotters
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        return $this->blotter->delete($id);
    }


    /**
     * Method to get all blotter data based on
     * @param int $perPage Data record display
     * @param int $page Data page display
     * @param int $userId ID of the barangay
     * @param string $keyword  Filter
     *
     * @return LengthAwarePaginator
     */
    public function getAll(Int $perPage, Int $page, String $keyword, Int $userId)
    {
        return $this->blotter->getAll($perPage,  $page,  $keyword, $userId);
    }
}
